from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.core.cache import cache
from .models import Task
from .serializer import TaskSerializer


class TaskListCreateAPIView(APIView):

    def get(self, request):

        cached_tasks = cache.get("tasks_list")

        if cached_tasks is not None:
            
            return Response(cached_tasks)
        

        tasks = Task.objects.all()

        serializer = TaskSerializer(
            tasks,
            many=True
        )

        cache.set(
            "tasks_list",
            serializer.data,
            timeout=60
        )
        

        return Response(serializer.data)

    def post(self, request):

        serializer = TaskSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            # Remove old cache
            cache.delete("tasks_list")

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class TaskDetailAPIView(APIView):

    def get_object(self, pk):
        try:
            return Task.objects.get(pk=pk)
        except Task.DoesNotExist:
            return None

    def get(self, request, pk):
        cache_key = f"task_{pk}"

        cached_task = cache.get(cache_key)

        if cached_task is not None:
            return Response(cached_task)

        task = self.get_object(pk)

        if task is None:
            return Response(
                {"error": "Task not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = TaskSerializer(task)

        cache.set(
            cache_key,
            serializer.data,
            timeout=60
        )

        return Response(serializer.data)

    # PUT
    def put(self, request, pk):
        task = self.get_object(pk)

        if task is None:
            return Response(
                {"error": "Task not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = TaskSerializer(
            task,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            # Update cache with new data
            cache_key = f"task_{pk}"
            cache.set(
                cache_key,
                serializer.data,
                timeout=60
            )

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # DELETE
    def delete(self, request, pk):
        task = self.get_object(pk)

        if task is None:
            return Response(
                {"error": "Task not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        task.delete()

        # Remove deleted task from cache
        cache_key = f"task_{pk}"
        cache.delete(cache_key)

        return Response(
            {"message": "Task deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )