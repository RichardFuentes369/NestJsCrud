import { Task } from "src/task/entity/task.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Task, (task) => task.user)
    @JoinColumn({ name: 'userId' })
    tasks: Task[]
}