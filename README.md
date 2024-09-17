# TaskMaster

TaskMaster is a web-based to-do list application designed to help users manage their tasks efficiently. It allows users to create dynamic to-do lists, add new items, and delete completed ones. The app also supports custom lists and integrates with MongoDB for persistent data storage.

## Features

- **Dynamic Task Lists**: Create, add, and delete tasks with ease.
- **Custom Lists**: Create personalized lists by visiting `/list-name`.
- **Data Persistence**: All tasks are stored in MongoDB for future access.
- **Responsive Design**: Clean and simple UI designed to be user-friendly.
- **Health Check**: A health check endpoint `/health` to monitor server status.

## Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express.js**: Web framework for handling routes and HTTP requests.
- **MongoDB**: NoSQL database for storing to-do list items.
- **Mongoose**: ODM for managing MongoDB collections.
- **EJS (Embedded JavaScript)**: Template engine for rendering dynamic HTML.
- **Lodash**: Utility library for manipulating data.

## Getting Started

### Prerequisites

Ensure that you have the following installed on your local development machine:

- **Node.js** (version 14.x or higher)
- **MongoDB** (local or cloud instance)

### Installation

1. Clone this repository to your local machine.

   ```bash
   git clone https://github.com/sonir746/TaskMaster.git
   ```

2. Navigate to the project directory.

   ```bash
   cd taskmaster
   ```

3. Install the required dependencies.

   ```bash
   npm install
   ```

4. Make sure MongoDB is running on your local machine or provide a connection string for a cloud instance in `app.js`:

   ```js
   mongoose.connect("mongodb://localhost:27017/todolistDB");
   ```

5. Start the application.

   ```bash
   npm start
   ```

6. Visit `http://localhost:3000` in your browser to start using the app.

## Project Structure

```
TaskMaster/
│
├── api/
│   ├── app.js          # Main server file (Express app)
│   ├── date.js         # Utility for date formatting
│
├── public/
│   └── css/
│       └── styles.css  # CSS for styling the UI
│
├── views/
│   ├── about.ejs       # EJS template for the About page
│   ├── footer.ejs      # EJS template for the Footer
│   ├── header.ejs      # EJS template for the Header
│   └── list.ejs        # EJS template for the To-Do list
│
├── package.json        # Project metadata and dependencies
├── .gitignore          # Ignoring unnecessary files for Git
└── README.md           # Documentation (this file)
```

## How to Use

1. **Add a Task**: Enter a task in the input field and hit the '+' button.
2. **Delete a Task**: Check the checkbox next to a completed task, and it will be deleted.
3. **Create Custom Lists**: Visit `/your-list-name` to create a new custom to-do list.
4. **About Page**: Learn more about the project by visiting `/about`.

## API Endpoints

- **`GET /`**: Displays the default to-do list.
- **`GET /about`**: Displays the About page.
- **`GET /:customListName`**: Dynamically creates or accesses a custom list.
- **`POST /`**: Adds a new task to the current list.
- **`POST /delete`**: Deletes a task from the current list.
- **`GET /health`**: Returns a status message to verify the health of the application.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/sonir746/TaskMaster/issues) if you'd like to contribute.

## License

This project is licensed under the **MIT License**.

## Author

👨🏻‍💻 **RAHUL SONI**

[![LinkedIn](https://img.shields.io/twitter/url?url=https%3A%2F%2Fwww.linkedin.com&style=social&logo=Linkedin&logoColor=White&label=LinkedIn&labelColor=blue&color=blue&cacheSeconds=3600)](https://www.linkedin.com/in/rahul-soni-004861227/)
[![GitHub](https://img.shields.io/twitter/url?url=https%3A%2F%2Fgithub.com%2F&style=social&logo=GitHub&logoColor=Black&label=GitHub&labelColor=abcdef&color=fedcba&cacheSeconds=3600)](https://github.com/sonir746)
