import { User } from 'src/user/entity/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: true })
  done: boolean;

  /*
  * Aquí creo la llave foranea de la tabla y la apunto a la tabla principal
  */
  @ManyToOne(() => User, (user) => user.id)
  user: User
}
