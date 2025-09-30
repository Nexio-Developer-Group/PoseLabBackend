<!-- how to create Modules -->
Step 1: Generate the Users module

nest g module users


Step 2: Generate Users service & controller

nest g service users
nest g controller users



<!-- how to make schama of the module -->
make schemas folder and make module_name.schema.ts file the define there

then add more data transfer object (validation on input)

    - make dto folder and make feateure_name.dto.ts file

then make the use the schemas in the modules.ts file of the module
