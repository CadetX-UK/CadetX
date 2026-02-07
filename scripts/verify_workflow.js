const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api';

async function run() {
    try {
        console.log('--- Starting Verification ---');

        // 1. Admin Login
        console.log('1. Admin Login...');
        const adminRes = await fetch(`${BASE_URL}/auth/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'k641259@gmail.com', password: 'CADETX' })
        });
        const adminData = await adminRes.json();
        if (!adminRes.ok) throw new Error(adminData.error);
        const adminToken = adminData.token;
        console.log('   Admin Logged In');

        // 2. Create Course
        console.log('2. Creating Course...');
        const courseRes = await fetch(`${BASE_URL}/admin/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                title: 'Test Course ' + Date.now(),
                description: 'A test course',
                price: 5000,
                duration: '10 weeks',
                level: 'Beginner'
            })
        });
        const courseData = await courseRes.json();
        if (!courseRes.ok) throw new Error(courseData.error);
        const courseId = courseData.course.id;
        console.log('   Course Created:', courseData.course.title);

        // 3. Register Student
        console.log('3. Registering Student...');
        const studentEmail = `student_${Date.now()}@test.com`;
        const studentRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: studentEmail,
                password: 'password123',
                name: 'Test Student',
                role: 'student'
            })
        });
        const studentData = await studentRes.json();
        if (!studentRes.ok) throw new Error(studentData.error);
        const studentToken = studentData.token;
        console.log('   Student Registered:', studentEmail);

        // 4. Enroll Student
        console.log('4. Enrolling Student...');
        const enrollRes = await fetch(`${BASE_URL}/student/enroll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${studentToken}`
            },
            body: JSON.stringify({ course_id: courseId })
        });
        if (!enrollRes.ok) throw new Error((await enrollRes.json()).error);
        console.log('   Student Enrolled');

        // 5. Check Dashboard (Should be pending)
        console.log('5. Checking Dashboard (Expect Pending)...');
        const dashRes1 = await fetch(`${BASE_URL}/student/dashboard`, {
            headers: { 'Authorization': `Bearer ${studentToken}` }
        });
        const dashData1 = await dashRes1.json();
        if (dashData1.student.accessGranted) throw new Error('Access should NOT be granted yet');
        console.log('   Verified: Access is Pending');

        // 6. Grant Access
        console.log('6. Granting Access...');
        const accessRes = await fetch(`${BASE_URL}/admin/access`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                student_id: studentData.user.id,
                access_granted: true
            })
        });
        if (!accessRes.ok) throw new Error((await accessRes.json()).error);
        console.log('   Access Granted');

        // 7. Check Dashboard (Should be active)
        console.log('7. Checking Dashboard (Expect Active)...');
        const dashRes2 = await fetch(`${BASE_URL}/student/dashboard`, {
            headers: { 'Authorization': `Bearer ${studentToken}` }
        });
        const dashData2 = await dashRes2.json();
        if (!dashData2.student.accessGranted) throw new Error('Access SHOULD be granted now');
        console.log('   Verified: Access is Granted');

        console.log('--- Verification SUCCESS ---');

    } catch (error) {
        console.error('--- Verification FAILED ---');
        console.error(error);
    }
}

run();
