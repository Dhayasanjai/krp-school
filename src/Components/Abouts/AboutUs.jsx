import "./AboutUs.css";
import { useEffect, useState } from "react";

const AboutUs = () => {
  const [stats, setStats] = useState({
    Students: "",
    Awards: "",
    Trainers: ""
  });

  const [targets, setTargets] = useState({
    Students: "",
    Awards: "",
    Trainers: ""
  });

  const [hasAnimated, setHasAnimated] = useState({
    Students: false,
    Awards: false,
    Trainers: false
  });

  // Fetch data from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("https://themithraa.com//RestApi/WebApi/about_us_content.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            api_key: "Mithra@2024"
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status) {
            const { Students, Awards, trainers } = data.Numbers[0];

            // Set targets based on the fetched data
            setTargets({
              Students,
              Awards,
              Trainers: trainers
            });

            // Trigger animations immediately after setting targets
            setTimeout(() => {
              animateCount("Students", Students);
              animateCount("Awards", Awards);
              animateCount("Trainers", trainers);
            }, 0);
          } else {
            console.error("Failed to fetch stats");
          }
        } else {
          console.error("Failed to fetch stats");
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  // Function to trigger count animation
  const animateCount = (key, target) => {
    const number = parseInt(target.match(/\d+/)[0]); // Extract number from string
    const duration = 2000; // Animation duration in ms
    const stepTime = Math.abs(Math.floor(duration / number));
    const startTime = performance.now();

    const updateCount = () => {
      const elapsedTime = performance.now() - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const count = Math.floor(progress * number);
      setStats(prevStats => ({
        ...prevStats,
        [key]: count + target.replace(/\d+/, '') // Append the remaining string (e.g., "+ Students")
      }));
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  };

  // Scroll Animation and Triggering Count-Up
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.fade-in');

      reveals.forEach((reveal, index) => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 100;

        if (elementTop < windowHeight - elementVisible) {
          reveal.classList.add('active');
          
          // Trigger the animation if it hasn't been animated yet
          const key = Object.keys(targets)[index];
          if (!hasAnimated[key] && targets[key]) {
            setHasAnimated(prev => ({
              ...prev,
              [key]: true
            }));
          }
        } else {
          reveal.classList.remove('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [targets, hasAnimated]);

  return (
    <div className='about-us'>
      <div className='container'>
        <div className="about-us-title brushstroke-container fade-in">
          <span className="brushstroke-text">About us</span>
        </div>

        <div className="about-us-content d-flex">
          <div className="text-content fade-in">
            <p>Mithraa Sports Private Limited is India's premier manufacturer of sports stacking products. Since 2016, we have been pioneers in the industry, dedicated to providing top-quality equipment that meets the needs of both novice and professional stackers.</p>
            <p>Our flagship product, the Mithraa Sports Stacking application, is designed to support stackers in enhancing their performance. Whether you're just starting or aiming to break records, our app offers the tools and guidance needed to excel in the sport.</p>
            <p>We are proud to be the official licensed sports stacking product provider for ISDA (International Students Development Association) events, a testament to our commitment to quality and innovation. At Mithraa Sports, we strive to empower athletes of all ages to achieve their best through our cutting-edge products and technology.</p>
          </div>

          <div className="stats-container fade-in">
            <div className="stat-circle">{stats.Students}</div>
            <div className="stat-circle">{stats.Awards}</div>
            <div className="stat-circle">{stats.Trainers}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;