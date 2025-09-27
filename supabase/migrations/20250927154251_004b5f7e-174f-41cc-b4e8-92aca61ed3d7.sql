-- Learning Management System Database Schema

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  difficulty_level TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes INTEGER DEFAULT 0,
  is_required BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES public.managers(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  lesson_order INTEGER NOT NULL DEFAULT 1,
  lesson_type TEXT NOT NULL DEFAULT 'video' CHECK (lesson_type IN ('video', 'text', 'quiz', 'assignment')),
  content_url TEXT, -- For video URLs or document URLs
  content_text TEXT, -- For text-based lessons
  duration_minutes INTEGER DEFAULT 0,
  is_required BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  time_limit_minutes INTEGER DEFAULT 30,
  passing_score INTEGER NOT NULL DEFAULT 70,
  max_attempts INTEGER DEFAULT 3,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES public.managers(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz questions table
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'essay')),
  question_order INTEGER NOT NULL DEFAULT 1,
  points INTEGER NOT NULL DEFAULT 1,
  correct_answer TEXT, -- For true/false and short answer
  explanation TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz question options table (for multiple choice)
CREATE TABLE public.quiz_question_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  option_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course enrollments table
CREATE TABLE public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- References employee/user
  enrolled_by UUID REFERENCES public.managers(id),
  enrollment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'overdue', 'failed')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  final_score INTEGER,
  is_required BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(course_id, user_id)
);

-- Create lesson completions table
CREATE TABLE public.lesson_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  enrollment_id UUID NOT NULL REFERENCES public.course_enrollments(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'needs_review')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_minutes INTEGER DEFAULT 0,
  score INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(lesson_id, user_id)
);

-- Create quiz attempts table
CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  enrollment_id UUID REFERENCES public.course_enrollments(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned', 'needs_review')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_minutes INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  max_possible_score INTEGER DEFAULT 0,
  percentage_score DECIMAL(5,2),
  passed BOOLEAN DEFAULT false,
  reviewed_by UUID REFERENCES public.managers(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz responses table
CREATE TABLE public.quiz_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  selected_option_id UUID REFERENCES public.quiz_question_options(id) ON DELETE SET NULL,
  text_response TEXT, -- For short answer and essay questions
  is_correct BOOLEAN,
  points_earned INTEGER DEFAULT 0,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(attempt_id, question_id)
);

-- Create learning assignments table (integration with existing tasks)
CREATE TABLE public.learning_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  assigned_to UUID NOT NULL, -- User being assigned
  assigned_by UUID NOT NULL REFERENCES public.managers(id),
  assignment_type TEXT NOT NULL CHECK (assignment_type IN ('course', 'quiz', 'lesson')),
  due_date TIMESTAMP WITH TIME ZONE,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'overdue', 'needs_review')),
  completion_notes TEXT,
  reviewed_by UUID REFERENCES public.managers(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for courses
CREATE POLICY "Admins and managers can manage courses" ON public.courses
FOR ALL USING (public.is_admin_user() OR public.is_admin_manager());

CREATE POLICY "Users can view active courses" ON public.courses
FOR SELECT USING (is_active = true);

-- Create RLS policies for lessons
CREATE POLICY "Admins and managers can manage lessons" ON public.lessons
FOR ALL USING (public.is_admin_user() OR public.is_admin_manager());

CREATE POLICY "Users can view active lessons" ON public.lessons
FOR SELECT USING (is_active = true);

-- Create RLS policies for quizzes
CREATE POLICY "Admins and managers can manage quizzes" ON public.quizzes
FOR ALL USING (public.is_admin_user() OR public.is_admin_manager());

CREATE POLICY "Users can view active quizzes" ON public.quizzes
FOR SELECT USING (is_active = true);

-- Create RLS policies for quiz questions
CREATE POLICY "Admins and managers can manage quiz questions" ON public.quiz_questions
FOR ALL USING (public.is_admin_user() OR public.is_admin_manager());

CREATE POLICY "Users can view active quiz questions" ON public.quiz_questions
FOR SELECT USING (is_active = true);

-- Create RLS policies for quiz question options
CREATE POLICY "Admins and managers can manage quiz options" ON public.quiz_question_options
FOR ALL USING (public.is_admin_user() OR public.is_admin_manager());

CREATE POLICY "Users can view quiz options" ON public.quiz_question_options
FOR SELECT USING (true);

-- Create RLS policies for course enrollments
CREATE POLICY "Admins and managers can manage enrollments" ON public.course_enrollments
FOR ALL USING (public.is_admin_user() OR public.is_admin_manager());

CREATE POLICY "Users can view their own enrollments" ON public.course_enrollments
FOR SELECT USING (user_id = auth.uid());

-- Create RLS policies for lesson completions
CREATE POLICY "Admins and managers can manage lesson completions" ON public.lesson_completions
FOR ALL USING (public.is_admin_user() OR public.is_admin_manager());

CREATE POLICY "Users can manage their own lesson completions" ON public.lesson_completions
FOR ALL USING (user_id = auth.uid());

-- Create RLS policies for quiz attempts
CREATE POLICY "Admins and managers can manage quiz attempts" ON public.quiz_attempts
FOR ALL USING (public.is_admin_user() OR public.is_admin_manager());

CREATE POLICY "Users can manage their own quiz attempts" ON public.quiz_attempts
FOR ALL USING (user_id = auth.uid());

-- Create RLS policies for quiz responses
CREATE POLICY "Admins and managers can manage quiz responses" ON public.quiz_responses
FOR ALL USING (public.is_admin_user() OR public.is_admin_manager());

CREATE POLICY "Users can manage their own quiz responses" ON public.quiz_responses
FOR SELECT USING (attempt_id IN (SELECT id FROM public.quiz_attempts WHERE user_id = auth.uid()));

-- Create RLS policies for learning assignments
CREATE POLICY "Admins and managers can manage learning assignments" ON public.learning_assignments
FOR ALL USING (public.is_admin_user() OR public.is_admin_manager());

CREATE POLICY "Users can view their own assignments" ON public.learning_assignments
FOR SELECT USING (assigned_to = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_courses_category ON public.courses(category);
CREATE INDEX idx_courses_is_active ON public.courses(is_active);
CREATE INDEX idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX idx_lessons_lesson_order ON public.lessons(lesson_order);
CREATE INDEX idx_quizzes_course_id ON public.quizzes(course_id);
CREATE INDEX idx_quiz_questions_quiz_id ON public.quiz_questions(quiz_id);
CREATE INDEX idx_course_enrollments_user_id ON public.course_enrollments(user_id);
CREATE INDEX idx_course_enrollments_status ON public.course_enrollments(status);
CREATE INDEX idx_lesson_completions_user_id ON public.lesson_completions(user_id);
CREATE INDEX idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX idx_learning_assignments_assigned_to ON public.learning_assignments(assigned_to);
CREATE INDEX idx_learning_assignments_status ON public.learning_assignments(status);

-- Create trigger for updating updated_at timestamps
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON public.quizzes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_enrollments_updated_at
  BEFORE UPDATE ON public.course_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lesson_completions_updated_at
  BEFORE UPDATE ON public.lesson_completions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quiz_attempts_updated_at
  BEFORE UPDATE ON public.quiz_attempts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_learning_assignments_updated_at
  BEFORE UPDATE ON public.learning_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();