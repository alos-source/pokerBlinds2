*** Keywords ***
Open WebApp
    New Browser    headless=False
    New Page       ${URL}

Close WebApp
    Close Browser
