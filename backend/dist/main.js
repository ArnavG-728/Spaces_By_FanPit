"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT') || 3001;
    const allowedOrigins = [
        configService.get('FRONTEND_URL'),
    ].filter(Boolean);
    if (process.env.NODE_ENV !== 'production') {
        allowedOrigins.push('http://localhost:3000', 'https://localhost:3000');
    }
    app.enableCors({
        origin: allowedOrigins,
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Spaces by FanPit API')
        .setDescription('API documentation for the Spaces by FanPit application')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map