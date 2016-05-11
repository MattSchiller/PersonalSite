# My Personal Webpage
### *With simulated typing*

The site is built with the React framework for ease in modularity and quick updating. The simulated typing component I built works by being given 3 pieces of information:
* **Stub**: The text to be displayed immediately upon loading
* **Writing**: The text that will be written out per the markup language (more below)
* **LineNum** (optional): Due to the possibility of wanting to have several components within a single page writing at once, this will sync the line numbers up

The markup was done to allow for html tags/component classes to be applied instantly (such as in the case of quoted text) or retroactively upon completion (keyword 'function' or 'var' etc), to simulate writing code within Sublime text editor. The escape character is "~" and precedes and terminates all markup commands:
* **Pause** [character: p]: followed by the amount of time to sit (in ms), used to simulate the fact that humans don't just crank out characters constantly.
* **Delete** [character: d]: followed by the number of prior characters to delete, simulating typos and lending a sense of humor/realism to the affair.
* **Class** [characters: c & C]: followed by the desired class to add (may use multiple classes by leaving a space between them). Lowercase creates a new span and adds the class to it immediately, uppercase C applies the class to the current span and creates a new, classless blank one for the following text.
  * Use of indent# classes are crucial to properly formatting the output.
* **Linebreak** [character: l]: followed by a dummy value, I use 0, ends the current line that's being typed.
* **Quotes** [character: q]: followed by a + or -, indicates that a string is being typed. Simulates the auto-complete of the double-quotes.
* **Hyperlinks** [character a]: Operates independently of class (though it does override any existing formatting when applied), used to create linked text, the escape character is followed immediately by the link itself.

I've built out the features that seemed necessary to me, but feel free to request/make other additions/changes as you see fit.

Thanks for looking!
