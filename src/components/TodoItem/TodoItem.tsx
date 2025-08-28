// File: src/components/TodoItem/TodoItem.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../api/todos';

type Props = {
  todo: Todo;
  loading?: boolean;
  disableActions?: boolean;
  onToggle: (todo: Todo) => void;
  onRename: (
    todo: Todo,
    title: string,
    done?: (success: boolean) => void,
  ) => void;
  onDelete: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loading = false,
  disableActions = false,
  onToggle,
  onRename,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);
  const showControls = useMemo(() => !isEditing, [isEditing]);

  useEffect(() => {
    setTitle(todo.title);
  }, [todo.title]);

  useEffect(() => {
    if (isEditing) {
      // wait a tick for input to mount
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    }
  }, [isEditing]);

  const startEdit = () => {
    if (loading || disableActions || todo.id === 0) {
      return;
    }

    setTitle(todo.title);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setTitle(todo.title);
  };

  const submitEdit = () => {
    onRename(todo, title, (success: boolean) => {
      if (success) {
        setIsEditing(false);
      }
      // If failed, keep edit form open
    });
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <li
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      onDoubleClick={startEdit}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={loading || disableActions || todo.id === 0}
          onChange={() => onToggle(todo)}
        />
        <span className="visually-hidden">Mark todo as complete</span>
      </label>

      {showControls ? (
        <>
          <span className="todo__title" data-cy="TodoTitle">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            aria-label="Delete todo"
            disabled={loading || disableActions || todo.id === 0}
            onClick={() => onDelete(todo)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={e => e.preventDefault()}>
          <input
            ref={inputRef}
            className="todo__title-field"
            data-cy="TodoTitleField"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={submitEdit}
            onKeyUp={onKeyUp}
            disabled={loading}
          />
        </form>
      )}

      {/* Loader overlay */}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', { 'is-active': loading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
