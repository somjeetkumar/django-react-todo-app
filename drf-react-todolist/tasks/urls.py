from django.urls import path
# from rest_framework.documentation import include_docs_urls

from . import views


urlpatterns = [
    # API v1
    path(
        "api/v1/tasks/",
        views.TaskListCreateAPIView.as_view(),
        name="task-list-create",
    ),

    path(
        "api/v1/tasks/<int:pk>/",
        views.TaskDetailAPIView.as_view(),
        name="task-detail",
    ),

    # API Documentation
    # path(
    #     "docs/",
    #     include_docs_urls(title="Tasks API"),
    # ),
]