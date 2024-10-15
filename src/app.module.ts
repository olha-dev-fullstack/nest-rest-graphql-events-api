import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './config/orm.config';
import { EventsModule } from './events/events.module';
import { AppDummy } from './app.dummy';
import { AppJapanService } from './app.japan.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
      envFilePath: `dev.env`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: ormConfig,
    }),
    EventsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: AppService,
      useClass: AppJapanService,
    },
    {
      provide: 'APP_NAME',
      useValue: 'Nest events backend',
    },
    {
      provide: 'MESSAGE',
      inject: [AppDummy],
      useFactory: (app) => `${app.dummy()} factory!`,
    },
    AppDummy,
  ],
})
export class AppModule {}
