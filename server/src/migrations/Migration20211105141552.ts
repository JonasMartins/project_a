import { Migration } from '@mikro-orm/migrations';

export class Migration20211105141552 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "comment" add column "author_id" uuid not null;');

    this.addSql('alter table "comment" add constraint "comment_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');
  }

}
