import { Migration } from '@mikro-orm/migrations';

export class Migration20210924191434 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "appointment" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "start" timestamptz(0) not null, "end" timestamptz(0) not null, "user_id" uuid not null, "item_id" uuid not null);');
    this.addSql('alter table "appointment" add constraint "appointment_pkey" primary key ("id");');

    this.addSql('alter table "appointment" add constraint "appointment_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "appointment" add constraint "appointment_item_id_foreign" foreign key ("item_id") references "item" ("id") on update cascade;');
  }

}
