library(shiny)

ui <- fluidPage(
  tags$head(
    tags$style(HTML("
      body {
        background-color: #f4f4f4;
        font-family: Arial, sans-serif;
      }
      .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 40px;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
      }
      .navbar {
        background-color: #428bca;
        color: #fff;
        margin-bottom: 20px;
        border-radius: 0;
      }
      .navbar-brand {
        font-size: 24px;
        padding: 15px;
      }
      .navbar-nav {
        padding: 15px;
      }
      .navbar-nav li {
        margin-right: 10px;
      }
      .navbar-nav li a {
        color: #fff;
        font-weight: bold;
      }
      .navbar-nav li a:hover {
        color: #f8f8f8; /* Change the text color on hover */
      }
      .title {
        text-align: center;
        color: #333;
      }
      .btn-primary {
        background-color: #428bca;
        border-color: #428bca;
      }
      .btn-primary:hover {
        background-color: #3071a9;
        border-color: #285e8e;
      }
      .output-container {
        margin-top: 30px;
      }
      .output-text {
        background-color: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 10px;
        min-height: 100px;
      }
    "))
  ),
  navbarPage(
    
    "Medical Prescrptioon App",
    theme = "inverse",
    tags$style(".navbar { color: black; }"),
    tabPanel(
      "Speech Recognition",
      div(class = "container",
          h2("Please speak the names of the medicines."),
          div(class = "output-container",
              h4("Click the button below to start speech recognition:"),
              actionButton("startButton", "Start Speech Recognition", class = "btn btn-primary"),
              div(class = "output-text",
                  h5("Output:"),
                  textOutput("output")
              )
          )
      )
    ),
    tabPanel(
      "About",
      div(class = "container",
          h2("About"),
          p("This is a Medical Prescrption app which converts speech to text"),
          p("Done By: Hariharan Ganesh, Sairam B, Aadithya Niranjan")
      )
    ),
    tabPanel(
      "Diagnosis",
      div(class = "container",
          h2("Diagnosis"),
          p("Perform the diagnosis here.")
      )
    )
  ),
  tags$script('
