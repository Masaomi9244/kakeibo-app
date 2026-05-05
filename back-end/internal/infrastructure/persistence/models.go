package persistence

import "time"

type userModel struct {
	CreatedAt          time.Time `gorm:"column:created_at"`
	UpdatedAt          time.Time `gorm:"column:updated_at"`
	ID                 string    `gorm:"column:id;primaryKey"`
	AuthProviderUserID string    `gorm:"column:auth_provider_user_id"`
	Email              string    `gorm:"column:email"`
}

func (userModel) TableName() string {
	return "users"
}

type expenseModel struct {
	Memo      *string   `gorm:"column:memo"`
	SpentAt   time.Time `gorm:"column:spent_at"`
	CreatedAt time.Time `gorm:"column:created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at"`
	ID        string    `gorm:"column:id;type:uuid;default:gen_random_uuid();primaryKey"`
	UserID    string    `gorm:"column:user_id"`
	Amount    int       `gorm:"column:amount"`
}

func (expenseModel) TableName() string {
	return "expenses"
}
