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

type incomeModel struct {
	Memo              *string   `gorm:"column:memo"`
	IncomeDate        time.Time `gorm:"column:income_date"`
	CreatedAt         time.Time `gorm:"column:created_at"`
	UpdatedAt         time.Time `gorm:"column:updated_at"`
	ID                string    `gorm:"column:id;type:uuid;default:gen_random_uuid();primaryKey"`
	UserID            string    `gorm:"column:user_id"`
	Amount            int       `gorm:"column:amount"`
	IncludedInBalance bool      `gorm:"column:included_in_balance"`
}

func (incomeModel) TableName() string {
	return "incomes"
}

type fixedCostModel struct {
	StartMonth time.Time `gorm:"column:start_month"`
	CreatedAt  time.Time `gorm:"column:created_at"`
	UpdatedAt  time.Time `gorm:"column:updated_at"`
	ID         string    `gorm:"column:id;type:uuid;default:gen_random_uuid();primaryKey"`
	UserID     string    `gorm:"column:user_id"`
	Name       string    `gorm:"column:name"`
	Amount     int       `gorm:"column:amount"`
	IsActive   bool      `gorm:"column:is_active"`
}

func (fixedCostModel) TableName() string {
	return "fixed_costs"
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
