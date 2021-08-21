import { Migration } from "@mikro-orm/migrations";

export class Migration20210731233644 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table "user" drop constraint if exists "user_id_check";'
        );

        this.addSql(
            'alter table "item" drop constraint if exists "item_id_check";'
        );
        this.addSql(
            'alter table "item" drop constraint if exists "item_reporter_id_check";'
        );
        this.addSql(
            'alter table "item" alter column "reporter_id" type uuid using ("reporter_id"::uuid);'
        );
        this.addSql(
            'alter table "item" drop constraint if exists "item_responsible_id_check";'
        );
        this.addSql(
            'alter table "item" alter column "responsible_id" type uuid using ("responsible_id"::uuid);'
        );
        this.addSql(
            'alter table "item" drop constraint if exists "item_approver_id_check";'
        );
        this.addSql(
            'alter table "item" alter column "approver_id" type uuid using ("approver_id"::uuid);'
        );
        this.addSql(
            'alter table "item" drop constraint if exists "item_status_check";'
        );
        this.addSql(
            'alter table "item" alter column "status" type text using ("status"::text);'
        );
        this.addSql(
            "alter table \"item\" add constraint \"item_status_check\" check (\"status\" in ('OPEN', 'IN_PROGRESS', 'REOPENED', 'RESOLVED', 'CLOSED', 'COMPLETED'));"
        );
        this.addSql('alter table "item" alter column "status" drop default;');
        this.addSql(
            'alter table "item" add constraint "item_pkey" primary key ("id");'
        );
    }
}
