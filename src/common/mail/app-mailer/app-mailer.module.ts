import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST || 'localhost',
        port: parseInt(process.env.SMTP_PORT || '1025', 10),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      defaults: {
        from: '"Stock Trading" <noreply@stock-trading.com>',
      },
      template: {
        dir: join(process.cwd(), 'dist', 'common', 'mail', 'templates'),
        adapter: new PugAdapter(),
        options: {
          pretty: false,
        },
      },
    }),
  ],
})
export class AppMailerModule {}
