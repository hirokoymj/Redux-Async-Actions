const {Employee} = require('../models/employees');
const {Counter} = require('../models/counter');
const express = require('express');
const router = express.Router();

/**
 * Returns paginated list of employees.
 * The default number of per page is set to 100.
 * If page number is not specified, it set to 1.
 * If there is no more employee an empty list, [], is returned.
 * @example
 * // URL:
 * http://localhost:8080/api/employees
 * http://localhost:8080/api/employees?page=1
 * http://localhost:8080/api/employees?page=all
 */
router.get('/', (req, res)=>{
  let pageSize = 100;
  let pageNumber = (Object.getOwnPropertyNames(req.query).length===0) ? 1 : req.query.page;

  if(pageNumber === 'all'){
    Employee
    .find()
    .sort({id: 1})
    .exec((err, employees)=>{
      if(err) return res.status(500).send(err);
      if(!employees) return res.status(404).send(err);
      res.json(employees);
    })
  }else{
    Employee
    .find()
    .sort({id: 1})
    .skip((pageNumber-1) * pageSize)
    .limit(pageSize)
    .exec((err, employees)=>{
      if(err) return res.status(500).send(err);
      if(!employees) return res.status(404).send(err);
      res.json(employees);
    })
  }
});

/**
 * Returns a single employee data.
 * @example
 * // URL:
 * // URL params: employee's ID, number
 * http://localhost:3000/api/employees/${id}
 */
router.get('/:id', (req, res)=>{
  const id = parseInt(req.params.id);
  Employee.find({id: id}, (err, employee)=>{
    if(err) return res.status(500).send(err);
    res.json(employee);
  })
});

/**
 * Returns total count of all employee data.
 * HTTP Method: POST
 * @example
 * // URL:
 * http://localhost:3000/api/employees/countDocs
 */
router.post('/countDocs', (req, res)=>{
  Employee.countDocuments({}, function (err, count) {
    if (err) return res.status(500).send(err);
    const countObj = {"count": count};
    //res.json({ "count": count});
    res.send(countObj);
  });
});

/**
 * Save new employee data.
 * HTTP Method: POST
 * @example
 * // URL:
 * http://localhost:3000/api/employees
 */
router.post('/', (req, res)=>{
  const {name, department, employee_annual_salary, job_titles} = req.body;
  // console.log(`Department: ${req.body.department}`);

  const employee = new Employee({
    name: name,
    department: department,
    employee_annual_salary: employee_annual_salary,
    job_titles:job_titles
  });

  employee.save(function(err){
    //res.send(employee);
    if(err) return res.status(500).send(err);
    res.json(employee);
  })
});

/**
 * DELETE an employee.
 * HTTP Method: DELETE
 * @params {number} - employee ID
 * @example
 * // URL
 * http://localhost:3000/api/employees/501
 * @returns {json} - deleted document
 */
router.delete('/:id', (req, res)=>{
  const id = parseInt(req.params.id);

  Employee.findOneAndDelete({"id": id}, function(err, employee){
    if(err) return res.status(500).send(err);
    if(!employee) return res.status(404).send(err);
    res.json(employee);
  });
});


/**
 * Update an employee.
 * HTTP Method: PUT
 * @param {number} - employee ID
 * @example 
 * // URL
 * http://localhost:3000/api/employees/501
 * @returns {json} - modified document: Must add options: {new: true} otherwise return an old document
 * 
 */
router.put('/:id', (req, res)=>{
  let id = parseInt(req.params.id);
  const {name, department, employee_annual_salary, job_titles} = req.body;  
  const update = {
    name,
    department,
    employee_annual_salary,
    job_titles
  }

  Employee.findOneAndUpdate({"id": id}, update, {new: true}, (err, employee)=>{
    if(err) return res.status(500).send(err);
    if(!employee) return res.status(404).send('Can not find data');
    res.json(employee); //!!! send modified document to React.!!!
  });
})


module.exports = router; 