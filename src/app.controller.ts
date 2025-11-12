import { Controller, Get } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiProperty,
} from "@nestjs/swagger";
import { AppService } from "./app.service";

class HealthResponseDto {
  @ApiProperty({ example: "ok", description: "Overall status of the service" })
  status: string;

  @ApiProperty({ example: 123.45, description: "Process uptime in seconds" })
  uptime: number;

  @ApiProperty({
    example: "2025-11-12T00:00:00.000Z",
    description: "ISO timestamp when the check was made",
  })
  timestamp: string;
}

@ApiTags("Health")
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
    };
  }
}
