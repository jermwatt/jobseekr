# JobSeekr: Custom Resumes and Cover Letters Generator

This repo contains a wip chrome extension for better job-targeted resume writing.  It is inspired by the [jobalytics extension](https://chrome.google.com/webstore/detail/jobalytics-resume-keyword/fkiljfkkceaopbpfgfmjdnkiejaifkgd).

JobSeekr is a powerful Chrome extension designed to assist job seekers in creating tailored resumes and cover letters that match the crucial keywords in job descriptions. With JobSeekr, you not only get automated generation, but also helpful feedback and suggestions on crucial keywords to add to your resumes.

Integrating seamlessly with Google Docs, JobSeekr analyzes job descriptions and provides real-time insights and suggestions on the most important keywords and phrases to include in your application materials. This ensures that your resumes and cover letters are optimized for each specific job opportunity.

## Key Features:

- Seamless Integration: JobSeekr seamlessly integrates with Google Docs, offering a convenient and familiar environment for creating and editing your application materials.
- Keyword Analysis and Suggestions: The extension analyzes job descriptions, providing valuable feedback and suggestions on crucial keywords to enhance the content of your resumes and cover letters.
- Time-Saving Versioning: JobSeekr enables you to quickly version your resumes and cover letters for different job descriptions, saving you time and effort in tailoring your application materials.
- Fast Insights for Human Review: JobSeekr streamlines the process of reviewing and optimizing your resumes and cover letters. Its fast insights help you fine-tune your application materials efficiently.
- Convenience: JobSeekr provides a user-friendly interface and tools that make the process of creating customized resumes and cover letters convenient and hassle-free.

Don't let your job applications go unnoticed. Elevate your chances of success with JobSeekr, the Chrome extension that empowers you to create compelling, keyword-optimized resumes and cover letters. Save time, gain valuable insights, and improve your employability with JobSeekr.

## Content script table of contents

A summary of the current set of content scripts - organized by directory:

**Keyword Analyzer:** Provides tools for cleaning and organizing keywords, facilitating their use in job pages and resumes.

**Highlighter:** Offers scripts and utilities for visually distinguishing keywords. It underlines keywords in red when they are present in the job post but not in the target resume, and in green when they are present in both.

**Job Extractor:** Includes functions and utilities for accurately extracting essential job description details from LinkedIn job posts opened in browser tabs.

**Popup:** Manages utilities and state control for the popup.html file, ensuring smooth functionality and user interaction.