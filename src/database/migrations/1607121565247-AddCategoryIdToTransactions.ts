import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";
// import { TableColumn } from "typeorm/schema-builder/table/TableColumn";
// import { TableForeignKey } from "typeorm/schema-builder/table/TableForeignKey";

export default class AddCategoryIdToTransactions1607121565247 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'transactions',
            new TableColumn({
                name: 'category_id',
                type: 'uuid',
                isNullable: true,
            }),
        );

        await queryRunner.createForeignKey(
            'transactions',
            new TableForeignKey({
                columnNames: ['category_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'categories',
                name: 'TransactionCategory',
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('transactions', 'TransactionCategory');
        await queryRunner.dropColumn('transactions', 'category_id');
    }

}
