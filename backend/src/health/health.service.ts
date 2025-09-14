import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class HealthService {
  constructor(
    private readonly http: HttpService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async check() {
    // DB check
    const dbReady = this.connection.readyState === 1; // 1 = connected

    // External probe (optional)
    let probeOk: boolean | null = null;
    const probeUrl = process.env.PROBE_URL;
    if (probeUrl) {
      try {
        const res = await firstValueFrom(this.http.get(probeUrl));
        probeOk = res.status >= 200 && res.status < 400;
      } catch (e) {
        probeOk = false;
      }
    }

    const green = dbReady && (probeOk !== false);

    return {
      status: green ? 'green' : 'yellow',
      db: dbReady ? 'up' : 'down',
      probe: probeOk,
      time: new Date().toISOString(),
    };
  }
}
