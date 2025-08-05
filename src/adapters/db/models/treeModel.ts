/* eslint-disable indent */
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'nodes' })
export class Node extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  label: string;

  @ForeignKey(() => Node)
  @AllowNull(true)
  @Column
  parentId?: number;

  @BelongsTo(() => Node, { foreignKey: 'parentId', onDelete: 'CASCADE', as: 'parent' })
  parent!: Node;

  @HasMany(() => Node, { foreignKey: 'parentId', as: 'children' })
  children!: Node[];
}
