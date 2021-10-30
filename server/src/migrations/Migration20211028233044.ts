import { Migration } from '@mikro-orm/migrations';

export class Migration20211028233044 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" rename column "picure" to "picture";');
  }

}
