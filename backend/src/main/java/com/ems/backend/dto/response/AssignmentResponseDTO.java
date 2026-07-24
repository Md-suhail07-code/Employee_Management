package com.ems.backend.dto.response;

public class AssignmentResponseDTO {

    private int assigned;
    private int skipped;

    public AssignmentResponseDTO() {
    }

    public AssignmentResponseDTO(int assigned, int skipped) {
        this.assigned = assigned;
        this.skipped = skipped;
    }

    public int getAssigned() {
        return assigned;
    }

    public void setAssigned(int assigned) {
        this.assigned = assigned;
    }

    public int getSkipped() {
        return skipped;
    }

    public void setSkipped(int skipped) {
        this.skipped = skipped;
    }
}
