# CS208 Full Stack Final Project

## Documentation

- Running the example project is documented [here](docs/example_project.md)
- An example README is provided [here](docs/README_example.md)

Run npm codespaces 

## Edge Cases Handled

Four edge cases have been handled in this project for increased application robustness:

### 1. **Comments With Only Whitespace**
Now, when a user posts a comment using only white space, the application will:
- Remove the white space in the input
- Check whether anything remains
- Display an error message: "Please enter a comment with actual text."
- **Code:** Trimmed the input in the `/create` route and validated that something remains before saving

### 2. **Long Comment Submission**
To handle long submissions, comments cannot exceed 1000 characters:
- An error message will be displayed
- Live character counting appears (0 / 1000)
- **Code:** The input box has `maxlength="1000"`, and server validation occurs with `if (task.length > 1000)`

### 3. **Server/API Unreachable**
In case the server/database fails to respond correctly:
- Instead of displaying a blank page or code number, a friendly error message will display
- Error message: "Sorry, we could not add your comment. Please try again later."
- **Code:** In case of a database error, all the error responses will generate a comments page that contains an `errorMessage`.

### 4. **Faster Double Clicking the 'Submit' Button**
In case the users fast-click on the submit button:
- Disables the button upon clicking
- Changes the button text to "Submitting...” to let the user know that it's being processed
- Prevents multiple entries
- **Code:** JavaScript on the form handles any submit action and locks the button


### Citations

### 1. Claude
To handle some early errors and to help fix some bugs I was having I used claude to help out. I used it a little more than I would have liked but I was really struggling with the pug and getting certain things to work especually when it came to the Edge cases. I also needed help with css specificly making it work for mobile and other devices.