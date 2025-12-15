import { Controller, Get } from "@nestjs/common"
import {
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags
} from "@nestjs/swagger"
import { AppService } from "./app.service"

class HealthResponseDto {
  @ApiProperty({ example: "ok", description: "Overall status of the service" })
  status: string

  @ApiProperty({ example: 123.45, description: "Process uptime in seconds" })
  uptime: number

  @ApiProperty({
    example: "2025-11-12T00:00:00.000Z",
    description: "ISO timestamp when the check was made"
  })
  timestamp: string
  @ApiProperty({
    example: {
      rss: 23456789,
      heapTotal: 12345678,
      heapUsed: 9876543,
      external: 123456
    },
    description: "Memory usage statistics of the Node.js process"
  })
  memory: Record<string, number>
  @ApiProperty({
    example: {
      total_heap_size: 12345678,
      total_heap_size_executable: 1234567,
      total_physical_size: 1234567,
      total_available_size: 12345678,
      used_heap_size: 9876543,
      heap_size_limit: 123456789,
      malloced_memory: 1234567,
      peak_malloced_memory: 2345678,
      does_zap_garbage: 0,
      number_of_native_contexts: 1,
      number_of_detached_contexts: 0
    },
    description: "V8 heap statistics"
  })
  heapStats: Record<string, number>
  @ApiProperty({
    example: {
      pid: 12345,
      nodeVersion: "v14.17.0",
      platform: "linux",
      argv: ["node", "dist/main.js"],

      env: {
        NODE_ENV: "production",
        TZ: "UTC"
      },
      cpus: 4,
      loadavg: [0.1, 0.5, 0.3]
    },
    description: "Process and environment configuration details"
  })
  config: Record<string, any>
}

@ApiTags("APP")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("health")
  @ApiOperation({ summary: "Get service health status" })
  @ApiOkResponse({ type: HealthResponseDto, description: "Service is healthy" })
  getHealth(): HealthResponseDto {
    return {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: { ...(process.memoryUsage ? process.memoryUsage() : {}) },
      heapStats:
        typeof require !== "undefined" ? require("v8").getHeapStatistics() : {},
      config: {
        pid: process.pid,
        nodeVersion: process.version,
        platform: process.platform,
        argv: process.argv,
        env: {
          NODE_ENV: process.env.NODE_ENV ?? null,
          TZ: process.env.TZ ?? null
        },
        cpus: typeof require !== "undefined" ? require("os").cpus().length : 0,
        loadavg: typeof require !== "undefined" ? require("os").loadavg() : []
      }
    }
  }
}
