import { Migration } from '@mikro-orm/migrations';

export class Migration20210828232034 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "role_id" uuid not null;');

    this.addSql('alter table "user" add constraint "user_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade;');
  }

}
