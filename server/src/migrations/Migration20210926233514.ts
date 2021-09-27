import { Migration } from '@mikro-orm/migrations';

export class Migration20210926233514 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "appointment" drop constraint if exists "appointment_end_check";');
    this.addSql('alter table "appointment" alter column "end" type timestamptz(0) using ("end"::timestamptz(0));');
    this.addSql('alter table "appointment" alter column "end" drop not null;');
  }

}
