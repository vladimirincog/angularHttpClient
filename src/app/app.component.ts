import { TodosService, Todo } from './services/todos.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [TodosService],
})
export class AppComponent implements OnInit {
  constructor(private todosService: TodosService) {}

  todos: Todo[] = [];
  todoTitle: string = '';
  loading: boolean = false;
  error: string = '';

  ngOnInit(): void {
    this.fetchTodos();
  }
  addTodo(): void {
    if (!this.todoTitle.trim()) {
      return;
    }
    const newTodo: Todo = {
      title: this.todoTitle,
      completed: false,
      id: 100, //Переделать эту ерунду - id должен возвращать сервер!
    };
    this.todosService.addTodo(newTodo).subscribe((value) => {
      console.log(value);
      this.todos.unshift(newTodo);
      this.todoTitle = '';
    });
  }

  fetchTodos(): void {
    this.loading = true;
    this.todosService.fetchTodos().subscribe(
      (todos) => {
        this.todos = todos;
        this.loading = false;
      },
      (error) => {
        this.error = error.message;
      },
      () => {
        console.log('Стрим завершился');
      }
    );
  }

  removeTodo(id: number): void {
    this.todosService.removeTodo(id).subscribe(() => {
      this.todos = this.todos.filter((t) => t.id != id);
    });
  }

  completeTodo(id: number): void {
    this.todosService.completeTodo(id).subscribe((todo) => {
      //this.todos.find((t) => t.id === todo.id).completed = true; // так было в видео, как я понял такакя штука не сработала потому что find возвращает значение, а не ссылку на элемент
      //поэтому было принято решение сделать так:
      this.todos[this.todos.findIndex((t) => t.id === todo.id)].completed =
        true;
    });
  }
}
