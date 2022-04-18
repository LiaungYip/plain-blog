---
draft: true
title: {{ replace .Name "-" " " | title }}
date: {{ dateFormat "2006-01-02T15:04:05Z07:00" .Date }}

# Explicitly setting an URL is optional.
# url: /blank_page

categories:
- Category 1
- Category 2

tags:
- Tag 1
- Tag 2

series: 
- Series 1

# Setting math: true will enable KaTeX for this page.
math: false

show_table_of_contents: false
---

Type your content here.
