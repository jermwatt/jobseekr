// remove quotes
function removeQuotes(str) {
    return str.replace(/['"]/g, '');
}  

// remove emojis from text
function removeEmojis(text) {
    var emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|\u261D|\uD83D[\uDC4D\uDC4E\uDC4C\uDC4F\uDC46\uDC47\uDC49-\uDC4B\uDC4A\uDC48]|[\u270A-\u270D]|[\uDC00-\uDFFF]|[\uD83C][\uDC00-\uDFFF]|[\uD83D][\uDC00-\uDFFF]|[\uD83E][\uDC00-\uDFFF]|[\u2600-\u27BF]/g;
  
    // Remove emojis from text (after converting to string)
    return text.toString().replace(emojiRegex, '').trim();
}

// create final dictionary with <strong> element as key </strong>
function createDictionary(arr) {
    const dict = {};
    let currentKey = null;
    for (let i = 0; i < arr.length; i++) {
      const entry = arr[i];
      if (entry.match(/^<strong>.*<\/strong>$/)) {
        // This entry matches the pattern <strong>*</strong>, so it's a key
        currentKey = entry.replace(/<[^>]+>/g, '').trim();
        dict[currentKey] = '';
      } else {
        // This entry is a value to be appended to the current key
        if (currentKey) {
          dict[currentKey] += entry.replace(/<[^>]+>/g, ' ').trim();
        }
      }
    }
    return dict;
  }
  

  // split on characters and keep the left part
  function splitAndKeepLeftFirst(input, characters) {
    var regex = new RegExp('(.*?' + characters + ')');
    var match = input.match(regex);
    if (match) {
      var left = match[1];
      var right = input.slice(left.length);
      return [left, right];
    }
    return [input];
  }
  
// wrapper for splitting string on <strong> tags
function splitStringByStrongTags(input) {
    if (input.startsWith('<strong>') && !input.endsWith('</strong>')) {
        return splitAndKeepLeftFirst(input, '</strong>');
    }
    return [input];
}

// main cleaner and splitter function 
function splitStringByPattern(str) {
    // remove unnecessary characters
    str = removeQuotes(removeEmojis(str))

    // split up string based on paragrahs
    var regex = /<br>.*?<\/br>/g 
    var split_str = str.split(regex);

    // remove <p> tags </p>
    for (var i = 0; i < split_str.length; i++) {
        split_str[i] = split_str[i].replace(/<p>/g, '').trim();
        split_str[i] = split_str[i].replace(/<\/p>/g, '').trim();
    }

    // check each element of split_str for <strong> tags with splitStringByStrongTags
    var new_split_str = [];
    for (var i = 0; i < split_str.length; i++) {
        split = splitStringByStrongTags(split_str[i]);
        if (split.length > 1) {
            new_split_str.push(split[0]);
            new_split_str.push(split[1]);
        }
        else {
            new_split_str.push(split[0]);
        }
    }

    // cut into dictionary based on <strong>
    var dictionary =  createDictionary(new_split_str);

    // console.log(dictionary);
    return dictionary
  }

var inputString = "<strong>Who is Recruiting from Scratch: </strong><p><br></br> </p>Recruiting from Scratch is a premier talent firm that focuses on placing the best product managers, software, and hardware talent at innovative companies. Our team is 100% remote and we work with teams across the United States to help them hire. We work with companies funded by the best investors including Sequoia Capital, Lightspeed Ventures, Tiger Global Management, A16Z, Accel, DFJ, and more.<p><br></br> </p><strong> Sr. Machine Learning Engineer </strong><p><br></br> </p>NYC-hybrid or 100% Remote (US)<p><br></br> </p>We believe everyone has a story to tell. Our mission is to make professional video and content creation accessible to all. We are taking recent advancements in computer graphics, the web, and machine learning to push the boundaries of creativity and in turn, lower the barriers of content creation; unfastening a new wave of storytelling <p><br></br> </p>Over the last three years, we’ve raised funding from top-tier investors including Coatue, Lux, and Amplify, all with a team small enough to fit at one (growing) table. Our team consists of creative, open minded, caring and entrepreneurial individuals from all walks of life. We aspire to build incredible things which starts with building an incredible team, so we’d love to hear from you! <p><br></br> </p><strong>About The Role </strong><p><br></br> </p>We’re building a next-generation creative tool that enables a new level of interactivity with cloud-based machine learning models. For our tool to be maximally expressive, we’re working to establish a seamless feedback loop between our users and the machine learning models powering our abilities. It’s not sufficient for our models to be accurate; nor is it enough for our user interface to be beautiful and responsive; we need to ensure that the link between the two is as fast and reliable as possible.<p><br></br> </p>For this reason, we’re looking for a <strong> Machine Learning Engineer </strong> who can help us create the server-side engine that powers our interactive tools for image and video synthesis. You’ll be working closely with our research and frontend teams to design and build low-latency, high-reliability machine learning deployments. We’re looking for someone who is deeply interested in the intersection of machine learning and systems design, and has extensive experience building web-based real-time server applications.<p><br></br> </p>A peek at our technical stack <p><br></br> </p>The rich UI of our video editing and collaboration tools is powered by Typescript and React/Redux, while the real time compositing and graphics engine behind our interactive preview runs on WebGL2 and WebAssembly. Our video streaming backend components are written in Python, use a lot of FFmpeg/libav and HLS for on-the-fly transcoding, PyTorch and TorchScript for ML inference, and are deployed as containerized services on Kubernetes. Our API endpoints for real-time collaboration and media asset management are written in Typescript and node.js and are deployed as serverless functions on AWS Lambda.<p><br></br> </p><strong>What You’ll Do </strong><p><br></br> </p><ul><li> Work with a world-class engineering team pushing the boundaries of content creation on the browser </li><li> Collaborate with our research team to deploy state-of-the-art computer vision models to production </li><li> Improve the performance and efficiency of our machine learning deployments </li></ul><p><br></br> </p><strong>What You’ll Need </strong><p><br></br> </p><ul><li> Solid knowledge of at least one machine learning research framework (e.g. PyTorch, Tensorflow), and at least one high-performance inference framework (e.g. TensorRT, Apache TVM) </li><li> Experience profiling and optimizing deep neural networks, including knowledge of GPU profiling tools such as NVIDIA Nsight </li><li> Familiarity with Python-based image and video manipulation/encoding/decoding frameworks, such as OpenCV and PyAV </li><li> Experience with cloud orchestration systems such as Kubernetes and cloud providers such as AWS, GCP, and Azure </li><li> Ability to write robust and maintainable client-server architectures and APIs </li><li> Ability to rapidly prototype solutions and iterate on them with tight product deadlines </li><li> Strong communication, collaboration, and documentation skills </li></ul><p><br></br> </p>We strives to recruit and retain exceptional talent from diverse backgrounds while ensuring pay equity for our team. Our salary ranges are based on competitive market rates for our size, stage and industry, and salary is just one part of the overall compensation package we provide.<p><br></br> </p>There are many factors that go into salary determinations, including relevant experience, skill level and qualifications assessed during the interview process, and maintaining internal equity with peers on the team. The range shared below is a general expectation for the function as posted, but we are also open to considering candidates who may be more or less experienced than outlined in the job description. In this case, we will communicate any updates in the expected salary range.<p><br></br> </p>Lastly, the provided range is the expected salary for candidates in the U.S. Outside of those regions, there may be a change in the range, which again, will be communicated to candidates.<p><br></br> </p><strong> Working Here  </strong><p><br></br> </p>We are a small and growing team of artists, engineers, researchers, and dreamers working together to reimagine creativity. And we’re building a unique team of talented individuals from diverse backgrounds. We believe that this will allow us to continue to up-level each other, our company, and our product. We’re looking for people that will add to our culture, not just fit in.<p><br></br> </p>We’re committed to creating a space where our employees can bring their full selves to work and have equal opportunity to succeed. So regardless of race, gender identity or expression, sexual orientation, religion, origin, ability, age, veteran status, if joining this mission speaks to you, we encourage you to apply!<p><br></br> </p>Salary: $165-210k base"
var inputString2 = "<p><strong>About the team & opportunity</strong></p><p><br></br> </p><p>What’s so great about working on Calendly’s Engineering team?</p><p>We make things possible for our customers through impactful innovation.</p><p>In this new function at Calendly, a Senior Machine Leaning Engineer will be able to help drive new initiatives and push the boundaries on what is possible by using the latest advancements in ML. You have a product focus and passion for using machine learning to solve real-world problems, and understand that being an effective engineer is about collaborating with people as much as it is about writing code.</p><p>You will join a great data team and be an integral part of building new, machine learning-based experiences for internal and external customers alike.</p><p><br></br> </p><p><strong>On a typical day, you will:</strong></p><ul><li>Work with unique, large structured data sets to build and continuously improve innovative machine learning models for Calendly product, business and operational use cases</li><li>Work collaboratively with partners including software engineering, product managers, decision and data scientists, to impact the business by understanding and prioritizing requirements for machine learning models</li><li>Hands-on develop, productionize, and operate machine learning models and pipelines at scale, including both batch and real-time use cases</li><li>Create large, scalable data ETL/ELT pipelines for new features to power our models</li><li>Leverage machine learning cloud services and tools to develop reusable, highly differentiating and high-performing machine learning systems, enable fast model development, low-latency serving and ease of model quality upkeep</li><li>Optimize ML models to meet latency SLAs at the scale of Calendlys production traffic and launch live experiments to evaluate model performance</li></ul><p><br></br> </p><p><strong>What do we need from you?</strong></p><ul><li>5+ years of industry experience in applied Machine Learning, inclusive MS or PhD in relevant fields</li><li>Strong programming (Python / Scala / Java / etc) and data engineering skills</li><li>Proficiency in ML frameworks such as: Keras, Tensorflow and PyTorch (in that order of importance) and ETL and ML workflow frameworks like Apache Spark, Beam, Airflow, VertexAI (Kubeflow Pipelines)</li><li>Deep understanding of Machine Learning processes (e.g. training/serving skew minimization, feature engineering, feature/model selection), algorithms (eg personalization and recommendation, anomaly detection, natural language processing)</li><li>Consistent record of efficiently implementing ML models using a managed service (VertexAI/Sagemaker) for high traffic, low latency, large data applications that produced substantial impact on the end users</li><li>Recognize when to seek assistance and willingness to learn whatever is needed to get the job done; ideally, you have some research experience</li><li>Strong verbal and written communication skills</li><li>Comfortable working remotely and with enabling tools like Slack, Confluence, etc.</li><li>Authorized to work lawfully in the United States of America as Calendly does not engage in immigration sponsorship at this time</li></ul><p><br></br> </p><p><strong>What’s in it for you?</strong></p><p>Ready to make a serious impact? Millions of people already rely on Calendly’s products, and we’re still in the midst of our growth curve — it’s a phenomenal time to join us. Everything you’ll work on here will accelerate your career to the next level. If you want to learn, grow, and do the best work of your life alongside the best people you’ve ever worked with, then we hope you’ll consider allowing Calendly to be a part of your professional career.</p><p><br></br> </p><p>If you are an individual with a disability and would like to request a reasonable accommodation as part of the application or recruiting process, please contact us at recruiting@calendly.com .</p><p>This specific role is not eligible for employment in Hawaii, or Alaska. Note that all individual roles will specify location eligibility.</p>"

var result = splitStringByPattern(inputString);

// var result = splitStringByPattern(inputString2);

console.log(result);