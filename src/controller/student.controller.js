import Student from "../model/student.model.js";

// Create a new student
const createStudent = async (req, res) => {
  try {
    const {
      name,
      branch,
      department,
      rollNumber,
      scholarNumber,
      enrollmentNumber,
      admissionYear,
      leaveUniversity,
      passOutYear,
      mobileNumber,
      emailAddress,
      fatherName,
      motherName,
      residenceAddress,
      parentContectNumber,
      semester,
      section,
      subjectinHighSchool,
      regular,
      busFacility,
      achivements,
    } = req.body;

    // Trim whitespace from string fields
    const trimmedData = {
      name: name?.trim(),
      branch: branch?.trim(),
      department: department?.trim(),
      rollNumber: rollNumber?.trim(),
      scholarNumber,
      enrollmentNumber: enrollmentNumber?.trim(),
      admissionYear,
      leaveUniversity,
      passOutYear,
      mobileNumber: mobileNumber?.trim(),
      emailAddress: emailAddress?.trim(),
      fatherName: fatherName?.trim(),
      motherName: motherName?.trim(),
      residenceAddress: residenceAddress?.trim(),
      parentContectNumber: parentContectNumber?.trim(),
      semester: semester?.trim(),
      section: section?.trim(),
      subjectinHighSchool: subjectinHighSchool?.trim(),
      regular,
      busFacility,
      achivements: achivements?.trim(),
    };

    // Check if all three fields are empty
    if (
      !trimmedData.scholarNumber &&
      !trimmedData.rollNumber &&
      !trimmedData.enrollmentNumber
    ) {
      // All three fields are empty, create a new student
      const newStudent = new Student(trimmedData);

      // Saving the new student to the database
      await newStudent.save();

      // Responding with the newly created student
      return res.status(201).json(newStudent);
    }

    // Build query object to find existing student
    let query = {};
    if (trimmedData.scholarNumber) {
      query.scholarNumber = trimmedData.scholarNumber;
      const student = await Student.findOne(query);
      if (student) {
        return res.status(400).json({ error: "scholar number already in use" });
      }
      query = {};
    }
    if (trimmedData.rollNumber) {
      query.rollNumber = trimmedData.rollNumber;
      const student = await Student.findOne(query);
      if (student) {
        return res.status(400).json({ error: "roll number already in use" });
      }
      query = {};
    }
    if (trimmedData.enrollmentNumber) {
      query.enrollmentNumber = trimmedData.enrollmentNumber;
      const student = await Student.findOne(query);
      if (student) {
        return res
          .status(400)
          .json({ error: "enrollment number already in use" });
      }
      query = {};
    }

    // Creating a new student instance
    const newStudent = new Student(trimmedData);

    // Saving the new student to the database
    await newStudent.save();

    // Responding with the newly created student
    return res.status(201).json(newStudent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creating student" });
  }
};

// Update an existing student using scholarNumber
const updateStudent = async (req, res) => {
  try {
    const { scholarNumber } = req.params;
    const updatedData = req.body;

    // Finding and updating the student by scholarNumber
    const updatedStudent = await Student.findOneAndUpdate(
      { scholarNumber },
      updatedData,
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Responding with the updated student
    return res.status(200).json(updatedStudent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error updating student" });
  }
};

// Read all students
const readStudents = async (req, res) => {
  try {
    // Fetching all students from the database
    const students = await Student.find().sort({ name: 1 });
    return res.status(200).json(students);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching students" });
  }
};

const filterStudents = async (req, res) => {
  try {
    const filterCriteria = req.body.filters; // Assuming the filter criteria are sent in the request body under "filters"

    // Building the query object
    let query = {};

    // Loop through the filter criteria and add to the query if they are present
    for (const key in filterCriteria) {
      if (
        filterCriteria.hasOwnProperty(key) &&
        filterCriteria[key] !== undefined &&
        filterCriteria[key] !== null
      ) {
        query[key] = filterCriteria[key];
      }
    }

    // Fetching filtered students from the database
    const students = await Student.find(query).sort({ name: 1 });

    return res.status(200).json(students);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching filtered students" });
  }
};

const uniqueScholarNumber = async (req, res) => {
  try {
    let randomnum;
    let attempts = 0;
    const maxAttempts = 1000; // Prevent infinite loop

    do {
      // Generate a random integer
      randomnum = Math.floor(Math.random() * 100000000);

      // Check if the scholar number already exists
      const student = await Student.findOne({ scholarNumber: randomnum });

      attempts++;
      if (student) {
        // If student exists, try a new number
        continue;
      } else {
        // If student does not exist, exit loop
        break;
      }
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      return res
        .status(500)
        .json({ error: "Unable to generate a unique scholar number" });
    }

    return res.status(200).json({ scholarNumber: randomnum });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Cannot create unique scholar number" });
  }
};

export {
  createStudent,
  updateStudent,
  readStudents,
  filterStudents,
  uniqueScholarNumber,
};
