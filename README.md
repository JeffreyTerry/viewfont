To add the fonts when pulling for the first time or to grab them from fontsquirrel again:

From the terminal, do:
$  cd font-download-tools
$  node crawler.js
$  node unzipper.js
$  node housekeeping.js

Then, using the files generated into 'font-download-tools' directory:
  1.  Replace '/assets/styles/fonts.css' with the generated 'fonts.css' file
  2.  Replace '/assets/js/fonts.js' with the generated 'fonts.js' file
  3.  Create or replace '/assets/fonts' with the generated 'fonts' folder





