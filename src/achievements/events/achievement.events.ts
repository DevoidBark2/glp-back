import { CourseComponentType } from 'src/component-task/enum/course-component-type.enum'

export class CommentAddedEvent {
	constructor(public readonly userId: string) {}
}

export class CourseCompletedEvent {
	constructor(public readonly userId: string) {}
}

export class QuizCompletedEvent {
	constructor(
		public readonly userId: string,
		public readonly score: number
	) {}
}

export class LoginStreakEvent {
	constructor(
		public readonly userId: string,
		public readonly days: number
	) {}
}

export class TaskSolvedEvent {
	constructor(
		public readonly userId: string,
		public readonly taskCount: number
	) {}
}

export class XPReceivedEvent {
	constructor(
		public readonly userId: string,
		public readonly xp: number
	) {}
}

export class AddAnswerForTask {
	constructor(
		public readonly userId: string,
		public readonly typeTask: CourseComponentType
	) {}
}
