import { Migration } from "@mikro-orm/migrations";

export class Migration20210831012347 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "sprint" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "code" varchar(5) not null, "description" text not null, "length" text check ("length" in (\'ONE\', \'TWO\', \'THREE\', \'FOUR\')) not null, "final" timestamptz(0) not null);'
        );
        this.addSql(
            'alter table "sprint" add constraint "sprint_pkey" primary key ("id");'
        );

        this.addSql('alter table "item" add column "sprint_id" uuid not null;');

        this.addSql(
            'alter table "item" add constraint "item_sprint_id_foreign" foreign key ("sprint_id") references "sprint" ("id") on update cascade;'
        );
    }
}
