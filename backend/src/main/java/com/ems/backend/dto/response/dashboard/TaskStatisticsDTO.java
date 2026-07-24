package com.ems.backend.dto.response.dashboard;

public class TaskStatisticsDTO {

    private long totalTasks;
    private long todoTasks;
    private long inProgressTasks;
    private long completedTasks;
    private long onHoldTasks;
    private long overdueTasks;
    private double completionPercentage;

    public TaskStatisticsDTO() {
    }

    public TaskStatisticsDTO(long totalTasks, long todoTasks, long inProgressTasks,
                             long completedTasks, long onHoldTasks, long overdueTasks,
                             double completionPercentage) {
        this.totalTasks = totalTasks;
        this.todoTasks = todoTasks;
        this.inProgressTasks = inProgressTasks;
        this.completedTasks = completedTasks;
        this.onHoldTasks = onHoldTasks;
        this.overdueTasks = overdueTasks;
        this.completionPercentage = completionPercentage;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getTodoTasks() {
        return todoTasks;
    }

    public void setTodoTasks(long todoTasks) {
        this.todoTasks = todoTasks;
    }

    public long getInProgressTasks() {
        return inProgressTasks;
    }

    public void setInProgressTasks(long inProgressTasks) {
        this.inProgressTasks = inProgressTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public long getOnHoldTasks() {
        return onHoldTasks;
    }

    public void setOnHoldTasks(long onHoldTasks) {
        this.onHoldTasks = onHoldTasks;
    }

    public long getOverdueTasks() {
        return overdueTasks;
    }

    public void setOverdueTasks(long overdueTasks) {
        this.overdueTasks = overdueTasks;
    }

    public double getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }
}
