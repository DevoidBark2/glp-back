export enum ActionEvent {
	CREATE_COURSE = 'CREATE_COURSE', // Создание курса
	UPDATE_COURSE = 'UPDATE_COURSE', // Обновление курса
	DELETE_COURSE = 'DELETE_COURSE', // Удаление курса
	PUBLISH_COURSE = 'PUBLISH_COURSE', // Публикация курса
	UNPUBLISH_COURSE = 'UNPUBLISH_COURSE', // Снятие курса с публикации

	ENROLL_STUDENT = 'ENROLL_STUDENT', // Запись студента на курс
	UNENROLL_STUDENT = 'UNENROLL_STUDENT', // Удаление студента с курса

	CREATE_LESSON = 'CREATE_LESSON', // Создание урока
	UPDATE_LESSON = 'UPDATE_LESSON', // Обновление урока
	DELETE_LESSON = 'DELETE_LESSON', // Удаление урока

	ADD_COMMENT = 'ADD_COMMENT', // Добавление комментария
	DELETE_COMMENT = 'DELETE_COMMENT', // Удаление комментария
	UPDATE_COMMENT = 'UPDATE_COMMENT', // Обновление комментария

	LOGIN = 'LOGIN', // Вход пользователя
	LOGOUT = 'LOGOUT', // Выход пользователя

	PASSWORD_RESET = 'PASSWORD_RESET', // Сброс пароля
	UPDATE_PROFILE = 'UPDATE_PROFILE', // Обновление профиля пользователя

	ADD_TEACHER = 'ADD_TEACHER', // Добавление учителя
	REMOVE_TEACHER = 'REMOVE_TEACHER', // Удаление учителя
	UPDATE_TEACHER = 'UPDATE_TEACHER', // Обновление данных учителя

	CREATE_CATEGORY = 'CREATE_CATEGORY', // Создание категории курса
	UPDATE_CATEGORY = 'UPDATE_CATEGORY', // Обновление категории курса
	DELETE_CATEGORY = 'DELETE_CATEGORY' // Удаление категории курса
}
