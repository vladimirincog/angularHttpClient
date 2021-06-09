import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';

export interface Todo {
  completed: boolean;
  title: string;
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  constructor(private http: HttpClient) {}

  headers = new HttpHeaders({
    //Загаловки для post
    MyCustomHeader: Math.random().toString(),
    MyCustomHeader2: 'ZZZ',
  });

  addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(
      'https://jsonplaceholder.typicode.com/todos',
      todo,
      {
        headers: this.headers,
      }
    );
  }

  fetchTodos(): Observable<any> {
    let params = new HttpParams(); //квери параметры для get то что в URL после знака ?
    params = params.append('_limit', '3');
    params = params.append('custom', 'anything');
    return this.http
      .get<Todo[]>('https://jsonplaceholder.typicode.com/todos?', {
        //params: new HttpParams().set('_limit', '3');
        params: params,
        observe: 'response', //позволяет получить дополнительную иформацию о запросе
      }) //нормальный URL https://jsonplaceholder.typicode.com/todos?_limit=2 не нормальный: https://jsonplaceholder.typicode.com/todos9?_limit=2
      .pipe(
        //Очень долги ответ от вервера..
        map((response) => {
          console.log(response);
          return response.body;
        }),
        delay(2500),
        catchError((error) => {
          //catchError - обрабатывает ошибку
          console.log('Error', error.message);
          return throwError(error); //throwError - возвращет новый стрим ошибки
        })
      );
  }

  removeTodo(id: number): Observable<any> {
    return this.http
      .delete<void>(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        observe: 'events', //все  события запроса которые происходят с асинхронным запросом, запрос подготовлен , запрос отжидается, получен и т.д.
      })
      .pipe(
        tap((event) => {
          if (event.type === HttpEventType.Sent) {
            console.log('Sent', event);
          }
          if (event.type === HttpEventType.Response) {
            console.log('Response', event);
          }
        })
      );
  }

  completeTodo(id: number): Observable<Todo> { //<Todo>
    return this.http.put<Todo>(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
      {
        completed: true,
      },
      {
        responseType: 'json' //тип ответа
      }
    );
  }
}
