import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Permission } from '@/modules/permissions/entities/permission.entity';
import { Role } from '@/modules/roles/entities/role.entity';

@Entity()
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Permission, { eager: true })
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}
