import { Migration } from "@mikro-orm/migrations";

export class Migration20210731153302 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table "user" add constraint "publisher_pkey" primary key ("id");'
        );

        this.addSql(
            'create table "item" ("id" uuid not null,"created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "summary" text not null, "description" text not null, "reporter_id" uuid not null, "responsible_id" uuid not null, "approver_id" uuid not null, "status" int2 not null default 1);'
        );

        this.addSql(
            'alter table "item" add constraint "item_reporter_id_foreign" foreign key ("reporter_id") references "user" ("id") on update cascade;'
        );
        this.addSql(
            'alter table "item" add constraint "item_responsible_id_foreign" foreign key ("responsible_id") references "user" ("id") on update cascade;'
        );
        this.addSql(
            'alter table "item" add constraint "item_approver_id_foreign" foreign key ("approver_id") references "user" ("id") on update cascade;'
        );
    }
}
