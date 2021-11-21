import { Migration } from "@mikro-orm/migrations";

export class Migration20211104173344 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "comment" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "body" text not null, "item_id" uuid not null, "parent_id" uuid not null);'
        );
        this.addSql(
            'alter table "comment" add constraint "comment_pkey" primary key ("id");'
        );

        this.addSql(
            'alter table "comment" add constraint "comment_item_id_foreign" foreign key ("item_id") references "item" ("id") on update cascade;'
        );
        this.addSql(
            'alter table "comment" add constraint "comment_parent_id_foreign" foreign key ("parent_id") references "comment" ("id") on update cascade;'
        );
    }
}
