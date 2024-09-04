import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { SESSION_COOKIE } from '@/config';
import {
  AuthenticationError,
  UnauthenticatedError,
} from '@/src/entities/errors/auth';
import { Todo } from '@/src/entities/models/todo';
import { getTodosForUserController } from '@/src/interface-adapters/controllers/todos/get-todos-for-user.controller';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserMenu } from '@/components/user-menu';
import { Separator } from '@/components/ui/separator';
import { Todos } from '@/components/todos';
import { CreateTodo } from '@/components/create-todo';

async function getTodos(sessionId: string | undefined) {
  try {
    return await getTodosForUserController(sessionId);
  } catch (err) {
    if (
      err instanceof UnauthenticatedError ||
      err instanceof AuthenticationError
    ) {
      redirect('/sign-in');
    }
    throw err;
  }
}

export default async function Home() {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;

  let todos: Todo[];
  try {
    todos = await getTodos(sessionId);
  } catch (err) {
    throw err;
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="flex flex-row items-center">
        <CardTitle className="flex-1">TODOs</CardTitle>
        <UserMenu />
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col p-6 gap-4">
        <CreateTodo />
        <Todos todos={todos} />
      </CardContent>
    </Card>
  );
}
