import { Achievement } from "src/achievements/entities/achievement.entity";
import { ConditionTypeEnum } from "src/achievements/enums/condition_type.enum";
import { DeepPartial } from "typeorm";

export const ACHIEVEMENTS_LIST: DeepPartial<Achievement>[] = [
    {
        id: 1,
        title: "Первый шаг",
        description: "Пройди свой первый курс и открой дорогу к знаниям!",
        icon: "🏁",
        condition: ConditionTypeEnum.COMPLETE_COURSES,
        targetValue: 1
    },
    {
        id: 2,
        title: "Путь мастера",
        description: "Пройди 5 курсов и стань опытным учеником.",
        icon: "🎓",
        condition: ConditionTypeEnum.COMPLETE_COURSES,
        targetValue: 5
    },
    {
        id: 3,
        title: "Просветленный",
        description: "Закрой 10 курсов и стань настоящим знатоком!",
        icon: "💡",
        condition: ConditionTypeEnum.COMPLETE_COURSES,
        targetValue: 10
    },
    {
        id: 4,
        title: "Стальная выдержка",
        description: "Пройди курс без единого пропущенного урока.",
        icon: "🛡️",
        condition: ConditionTypeEnum.COURSE_COMPLETION_STREAK,
        targetValue: 1
    },
    {
        id: 5,
        title: "Рекорд посещаемости",
        description: "Заходи на платформу 7 дней подряд.",
        icon: "📅",
        condition: ConditionTypeEnum.LOGIN_STREAK,
        targetValue: 7
    },
    {
        id: 6,
        title: "Мозговой штурм",
        description: "Реши 20 текстовых задач.",
        icon: "🧠",
        condition: ConditionTypeEnum.SOLVE_PRACTICE_PROBLEMS,
        targetValue: 20
    },
    {
        id: 7,
        title: "Квиз-гений",
        description: "Ответь правильно на 10 квизов без ошибок.",
        icon: "✅",
        condition: ConditionTypeEnum.COMPLETE_QUIZ,
        targetValue: 10
    },
    {
        id: 8,
        title: "Снайпер",
        description: "Достигни 90% правильных ответов в одном курсе.",
        icon: "🎯",
        condition: ConditionTypeEnum.ACHIEVE_HIGH_SCORE,
        targetValue: 90
    },
    {
        id: 9,
        title: "Идеальный результат",
        description: "Пройди тест на 100% без ошибок.",
        icon: "🌟",
        condition: ConditionTypeEnum.COMPLETE_ASSESSMENT,
        targetValue: 100
    },
    {
        id: 10,
        title: "Флеш",
        description: "Пройди квиз быстрее 10 секунд и правильно ответь на все вопросы.",
        icon: "⚡",
        condition: ConditionTypeEnum.COMPLETE_QUIZ,
        targetValue: 10
    },
    {
        id: 11,
        title: "Чай не мой друг",
        description: "Учись без перерыва 3 часа подряд.",
        icon: "☕🚫",
        condition: ConditionTypeEnum.STUDY_HOURS,
        targetValue: 3
    },
    {
        id: 12,
        title: "В огне!",
        description: "Заходи на платформу 30 дней без пропусков.",
        icon: "🔥",
        condition: ConditionTypeEnum.LOGIN_STREAK,
        targetValue: 30
    },
    {
        id: 13,
        title: "Будущий эксперт",
        description: "Набери 500 XP на платформе.",
        icon: "🏆",
        condition: ConditionTypeEnum.EARN_POINTS,
        targetValue: 500
    },
    {
        id: 14,
        title: "ТОП недели",
        description: "Попади в ТОП-10 пользователей недели.",
        icon: "🥇",
        condition: ConditionTypeEnum.TOP_LEARNER,
        targetValue: 10
    },
    {
        id: 15,
        title: "Мастер многоответа",
        description: "5 раз подряд правильно ответь в заданиях с мультивыбором.",
        icon: "📊",
        condition: ConditionTypeEnum.COMPLETE_QUIZ,
        targetValue: 5
    },
    {
        id: 16,
        title: "Читер?",
        description: "Пройди курс быстрее, чем за 1 час.",
        icon: "⏳",
        condition: ConditionTypeEnum.COURSE_COMPLETION_STREAK,
        targetValue: 1
    },
    {
        id: 17,
        title: "За гранью возможного",
        description: "Пройди курс с 5 разными режимами обучения.",
        icon: "🎭",
        condition: ConditionTypeEnum.COMPLETE_COURSES,
        targetValue: 5
    },
    {
        id: 18,
        title: "Наставник",
        description: "Помогите новичку освоиться на платформе.",
        icon: "🤝",
        condition: ConditionTypeEnum.MENTOR_STUDENTS,
        targetValue: 1
    },
    {
        id: 19,
        title: "Голос сообщества",
        description: "Оставь 5 полезных отзывов к курсам.",
        icon: "💬",
        condition: ConditionTypeEnum.GIVE_FEEDBACK,
        targetValue: 5
    },
    {
        id: 20,
        title: "Дзен",
        description: "Заверши курс, не ошибившись ни разу.",
        icon: "🧘",
        condition: ConditionTypeEnum.COMPLETE_COURSES,
        targetValue: 1
    }
];
