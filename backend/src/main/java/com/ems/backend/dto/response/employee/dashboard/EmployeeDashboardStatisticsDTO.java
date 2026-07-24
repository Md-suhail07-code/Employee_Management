package com.ems.backend.dto.response.employee.dashboard;

public class EmployeeDashboardStatisticsDTO {

    private long assignedTasks;
    private long completedTasks;
    private long inProgressTasks;
    private long todoTasks;
    private long onHoldTasks;
    private double completionPercentage;
    private long overdueTasks;

    public EmployeeDashboardStatisticsDTO() {
    }

    public EmployeeDashboardStatisticsDTO(long assignedTasks, long completedTasks, long inProgressTasks,
                                          long todoTasks, long onHoldTasks, double completionPercentage,
                                          long overdueTasks) {
        this.assignedTasks = assignedTasks;
        this.completedTasks = completedTasks;
        this.inProgressTasks = inProgressTasks;
        this.todoTasks = todoTasks;
        this.onHoldTasks = onHoldTasks;
        this.completionPercentage = completionPercentage;
        this.overdueTasks = overdueTasks;
    }

    public long getAssignedTasks() {
        return assignedTasks;
    }

    public void setAssignedTasks(long assignedTasks) {
        this.assignedTasks = assignedTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public long getInProgressTasks() {
        return inProgressTasks;
    }

    public void setInProgressTasks(long inProgressTasks) {
        this.inProgressTasks = inProgressTasks;
    }

    public long getTodoTasks() {
        return todoTasks;
    }

    public void setTodoTasks(long todoTasks) {
        this.todoTasks = todoTasks;
    }

    public long getOnHoldTasks() {
        return onHoldTasks;
    }

    public void setOnHoldTasks(long onHoldTasks) {
        this.onHoldTasks = onHoldTasks;
    }

    public double getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public long getOverdueTasks() {
        return overdueTasks;
    }

    public void setOverdueTasks(long overdueTasks) {
        this.overdueTasks = overdueTasks;
    }
}
