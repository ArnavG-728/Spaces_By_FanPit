"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({ origin: 'http://localhost:3000', credentials: true });
    app.useGlobalPipes(new common_1.ValidationPipe());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Spaces By FanPit API')
        .setDescription('REST API for users, spaces, bookings, check-ins, and issues')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    await app.listen(process.env.PORT || 3001);
}
bootstrap();
//# sourceMappingURL=main.js.map