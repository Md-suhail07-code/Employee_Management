package com.ems.backend.service.impl;

import com.ems.backend.dto.employee.EmployeeRequest;
import com.ems.backend.dto.employee.EmployeeResponse;
import com.ems.backend.entity.Employee;
import com.ems.backend.entity.Project;
import com.ems.backend.entity.Role;
import com.ems.backend.entity.User;
import com.ems.backend.repository.EmployeeRepository;
import com.ems.backend.repository.UserRepository;
import com.ems.backend.service.EmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeServiceImpl(
            EmployeeRepository employeeRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public EmployeeResponse createEmployee(EmployeeRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        // Generate employee code: EMP + 4 digits using max id + 1
        Long maxId = employeeRepository.findMaxId().orElse(0L);
        String employeeCode = String.format("EMP%04d", maxId + 1);

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.EMPLOYEE)
                .build();

        userRepository.save(user);

        Employee employee = Employee.builder()
                .employeeCode(employeeCode)
                .department(request.getDepartment())
                .designation(request.getDesignation())
                .phone(request.getPhone())
                .joiningDate(request.getJoiningDate())
                .user(user)
                .build();

        Employee savedEmployee = employeeRepository.save(employee);

        return mapToResponse(savedEmployee);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponse> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        return employees.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponse getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));
        return mapToResponse(employee);
    }

    @Override
    @Transactional
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));

        User user = employee.getUser();
        if (!user.getEmail().equalsIgnoreCase(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        // Password is NOT updated here

        employee.setDepartment(request.getDepartment());
        employee.setDesignation(request.getDesignation());
        employee.setPhone(request.getPhone());
        employee.setJoiningDate(request.getJoiningDate());

        Employee updatedEmployee = employeeRepository.save(employee);
        return mapToResponse(updatedEmployee);
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));

        if (employee.getProjects() != null) {
            for (Project project : employee.getProjects()) {
                project.getEmployees().remove(employee);
            }
        }

        employeeRepository.delete(employee);
    }

    private EmployeeResponse mapToResponse(Employee employee) {
        return EmployeeResponse.builder()
                .id(employee.getId())
                .employeeCode(employee.getEmployeeCode())
                .name(employee.getUser().getName())
                .email(employee.getUser().getEmail())
                .department(employee.getDepartment())
                .designation(employee.getDesignation())
                .phone(employee.getPhone())
                .joiningDate(employee.getJoiningDate())
                .build();
    }
}
