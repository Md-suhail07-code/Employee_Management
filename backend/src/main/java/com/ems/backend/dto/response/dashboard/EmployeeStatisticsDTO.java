package com.ems.backend.dto.response.dashboard;

public class EmployeeStatisticsDTO {

    private long totalEmployees;
    private long activeEmployees;
    private long inactiveEmployees;
    private long newEmployeesThisMonth;
    private long employeesJoinedToday;
    private long employeesJoinedThisWeek;
    private long employeesJoinedThisMonth;

    public EmployeeStatisticsDTO() {
    }

    public EmployeeStatisticsDTO(long totalEmployees, long activeEmployees, long inactiveEmployees,
                                 long newEmployeesThisMonth, long employeesJoinedToday,
                                 long employeesJoinedThisWeek, long employeesJoinedThisMonth) {
        this.totalEmployees = totalEmployees;
        this.activeEmployees = activeEmployees;
        this.inactiveEmployees = inactiveEmployees;
        this.newEmployeesThisMonth = newEmployeesThisMonth;
        this.employeesJoinedToday = employeesJoinedToday;
        this.employeesJoinedThisWeek = employeesJoinedThisWeek;
        this.employeesJoinedThisMonth = employeesJoinedThisMonth;
    }

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public long getActiveEmployees() {
        return activeEmployees;
    }

    public void setActiveEmployees(long activeEmployees) {
        this.activeEmployees = activeEmployees;
    }

    public long getInactiveEmployees() {
        return inactiveEmployees;
    }

    public void setInactiveEmployees(long inactiveEmployees) {
        this.inactiveEmployees = inactiveEmployees;
    }

    public long getNewEmployeesThisMonth() {
        return newEmployeesThisMonth;
    }

    public void setNewEmployeesThisMonth(long newEmployeesThisMonth) {
        this.newEmployeesThisMonth = newEmployeesThisMonth;
    }

    public long getEmployeesJoinedToday() {
        return employeesJoinedToday;
    }

    public void setEmployeesJoinedToday(long employeesJoinedToday) {
        this.employeesJoinedToday = employeesJoinedToday;
    }

    public long getEmployeesJoinedThisWeek() {
        return employeesJoinedThisWeek;
    }

    public void setEmployeesJoinedThisWeek(long employeesJoinedThisWeek) {
        this.employeesJoinedThisWeek = employeesJoinedThisWeek;
    }

    public long getEmployeesJoinedThisMonth() {
        return employeesJoinedThisMonth;
    }

    public void setEmployeesJoinedThisMonth(long employeesJoinedThisMonth) {
        this.employeesJoinedThisMonth = employeesJoinedThisMonth;
    }
}
