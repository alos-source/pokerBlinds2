*** Settings ***
Library           Browser

*** Variables ***
${URL}                  http://www.pokermaster.online/
${URL-local}            http://localhost:8000  # URL deiner WebApp


*** Test Cases ***
Open WebApp And Verify Elements
    [Documentation]    This test opens the web app and verifies basic UI elements.
    New Browser        headless=False    # Set to True for CI environments
    New Page           ${URL}
    Get Element     input#blindTime
    Get Element     button#startBtn
    Get Element     button#pauseBtn
    Close Browser

Test Form Functionality
    [Documentation]    This test enters values into form fields and verifies results.
    New Browser        headless=False
    New Page           ${URL}
    Fill Text          input#blindTime    1
    Fill Text          input#blindLevels  25/50,50/100,75/150
    Click              button#startBtn
    Wait For Elements State    text=Current Blind: 25/50    visible
    Close Browser

Test Button UI
    [Documentation]    This test toggles the visibility of the pause button.
    New Browser        headless=False
    New Page           ${URL}
    Wait For Elements State    input#blindTime    visible
    
    Wait For Elements State    button#startBtn    visible
    Wait For Elements State    button#pauseBtn    hidden
    Wait For Elements State    button#endBtn    hidden

    Click    \#startBtn

    Wait For Elements State    button#pauseBtn    visible
    
    Wait For Elements State    button#endBtn    visible
    Click    \#endBtn
    
    Wait For Elements State    button#downloadLogBtn    visible
    Click    \#downloadLogBtn    

    Close Browser

    