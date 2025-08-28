// File: src/components/TodoList/TodoList.tsx
import React from 'react';
import { Todo } from '../../api/todos';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingIds: Set<number>;
  updatingIds: Set<number>;
  onToggle: (todo: Todo) => void;
  onRename: (
    todo: Todo,
    title: string,
    done?: (success: boolean) => void,
  ) => void;
  onDelete: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingIds,
  updatingIds,
  onToggle,
  onRename,
  onDelete,
}) => {
  return (
    <ul className="todoapp__list" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loading={deletingIds.has(todo.id) || updatingIds.has(todo.id)}
          disableActions={deletingIds.has(todo.id)}
          onToggle={onToggle}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key="temp"
          todo={tempTodo}
          loading
          disableActions
          onToggle={() => {}}
          onRename={() => {}}
          onDelete={() => {}}
        />
      )}
    </ul>
  );
};
